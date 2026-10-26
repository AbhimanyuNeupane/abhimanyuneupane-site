Before we can understand OCSP, we need to understand the CRL.

## CRL (Certificate Revocation List)

The definition lies in the name. A Certificate Revocation List is essentially a *"blocklist of X.509 digital certificates"*: a list of certificates that a certificate authority revoked **before their scheduled expiration date** and that should no longer be trusted.

CRLs let clients confirm a certificate's status. The CA adds the serial numbers of revoked certificates to a list that it signs and maintains, along with the date and time each was revoked and the reason.

Certificates can be revoked for several reasons. For example, if a user authenticates with a certificate and then leaves the company, we revoke that certificate so no one can use it to authenticate again.

Simple, isn't it? Of course!

**But.**

Over time, this list can grow large depending on how many certificates are issued and revoked. That hurts network performance, because many clients have to download the CRL. Windows clients time out after 15 seconds while trying to download a CRL.

The main issue is that a CRL contains information about *every* revoked certificate, which can be an excessive amount of data when an application or operating system only needs to know the status of a few specific certificates.

To use a CRL, the client has to download the entire list and then parse it to find a matching serial number. That is inefficient and resource-intensive, especially at scale.

So what now? I've got you.

## OCSP (Online Certificate Status Protocol)

OCSP addresses the limitations of CRLs. It returns the revocation status of a single X.509 certificate as a real-time check. The OCSP responder sends back one of three statuses (**good**, **revoked** or **unknown**) and the client reacts accordingly.

### How it works

1. The client sends a request containing the certificate's serial number to the OCSP responder (also called the OCSP server).
2. The responder checks whether it has a cached response for that certificate. If not, it checks whether it has the CA's CRL cached locally.
3. If the CRL is cached, the responder checks the revocation status and sends a signed response. If not, it retrieves the CRL from the CA's distribution point, parses it, determines the status and sends a signed response.
4. The response is signed with the OCSP responder's certificate.

![OCSP request and response flow](https://nztobuxccpkfigmxqqmb.supabase.co/storage/v1/object/public/media/migrated/2024/04/ocsp-flow.png)

*Image source: [The SSL Store](https://www.thesslstore.com/blog/wp-content/uploads/2020/07/certificate-revocation-ocsp.png)*

Now that we understand CRL and OCSP, see how to set up an OCSP lab on Windows Server in [this article](https://medium.com/@abhimanyuneupane/lab-setup-of-ocsp-2804ee1f73ad).

### References

1. [CRL explained: what is a certificate revocation list?](https://www.thesslstore.com/blog/crl-explained-what-is-a-certificate-revocation-list/)
2. [Implementing an OCSP responder, part I: introducing OCSP](https://techcommunity.microsoft.com/t5/ask-the-directory-services-team/implementing-an-ocsp-responder-part-i-introducing-ocsp/ba-p/396493)
3. [What is OCSP and how does it work?](https://blog.ascertia.com/what-is-ocsp-and-how-does-it-work)
4. [OCSP, OCSP stapling and OCSP must-staple](https://www.thesslstore.com/blog/ocsp-ocsp-stapling-ocsp-must-staple/)
