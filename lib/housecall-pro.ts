import { normalizePhone } from "@/lib/lead-validation";

/**
 * Push a website lead into Housecall Pro, so it lands in Job Inbox beside their Angi and Yelp
 * leads. **Server only. Never import this from a client component.**
 *
 * ⚠️ THE THINGS THAT WILL HURT YOU, all verified read only against their live account:
 *
 * 1. **Write nests the address, read flattens it.** `POST` takes `customer.addresses[]`; `GET`
 *    returns a single top level `address`. Send it flat and the lead arrives with no location,
 *    permanently, because there is **no DELETE endpoint**.
 * 2. **The phone field is `mobile_number`, never `phone`**, and it is stored as a plain 10 digit
 *    string with no punctuation.
 * 3. **A zip only address is normal here, not a degradation.** All 92 of their Yelp leads carry zip
 *    as the only populated address field, street city and state all null. Our form matches that
 *    shape exactly.
 * 4. **No idempotency key and no DELETE.** A blind retry can permanently duplicate a real person in
 *    an account of 6,000+ customers they mail postcards to. Retry only where the response proves
 *    nothing was written. Never on a 5xx or a timeout, which are ambiguous.
 * 5. **Creating a lead also creates a real Customer record.** Confirmed by pulling the linked
 *    `customer.id` back out of `/customers/{id}`. This is not a lightweight object.
 * 6. **`notifications_enabled: false` is sent explicitly and is NOT proven.** All 263 live leads
 *    show `true`; there is no record in the account showing `false`, so the suppression behaviour
 *    has no empirical confirmation. Never rely on a default here, and treat the first real push as
 *    the thing that finally tests it. This is why `CLIENT-ASKS` #34b insists Jason is present.
 * 7. **`lead_source: "Trinity Website"` already exists** in their 71 configured sources, so we are
 *    not creating one implicitly. We would be its first user: 0 of 263 leads currently carry it.
 */

export type HcpLead = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  zip?: string;
  message?: string;
};

const API = "https://api.housecallpro.com";

/** Marks a failure as safe to retry. Only where the response proves nothing was written. */
export class HcpPermanentError extends Error {}

export async function pushLeadToHcp(lead: HcpLead, apiKey: string): Promise<{ id: string }> {
  const body = {
    lead_source: "Trinity Website",
    // Written to BOTH on purpose. Across 263 live leads a top level `note` has never been seen
    // populated and `customer.notes` appears on only 2, so which one HCP actually keeps is
    // unresolved without a write. Sending both is harmless and guarantees the description survives.
    note: lead.message || undefined,
    customer: {
      first_name: lead.firstName,
      last_name: lead.lastName,
      mobile_number: normalizePhone(lead.phone),
      email: lead.email || undefined,
      notifications_enabled: false,
      notes: lead.message || undefined,
      addresses: lead.zip ? [{ type: "service", zip: lead.zip }] : undefined,
    },
  };

  const res = await fetch(`${API}/leads`, {
    method: "POST",
    headers: { Authorization: `Token ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 300);
    // 4xx means our payload was wrong and nothing was written, so retrying it unchanged is futile.
    // 5xx and timeouts are ambiguous, so they throw a plain Error and stay retryable.
    if (res.status >= 400 && res.status < 500) {
      throw new HcpPermanentError(`HCP rejected the lead (${res.status}): ${detail}`);
    }
    throw new Error(`HCP push failed (${res.status}): ${detail}`);
  }

  const json = (await res.json()) as { id?: string };
  if (!json.id) throw new Error("HCP returned 2xx with no lead id, treating as ambiguous");
  return { id: json.id };
}
