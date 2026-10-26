## LDAP authentication

LDAP stands for Lightweight Directory Access Protocol, and LDAP authentication follows the client/server model. LDAP helps organizations store and access usernames and passwords within their network and across applications, and verifies those credentials whenever users try to access an LDAP directory or LDAP-enabled systems and applications. It's an essential tool for any business because of how it interacts with directory services, most commonly Microsoft's Active Directory. LDAP is the means of communicating with Active Directory and connecting clients with the information the directory service stores.

## How does LDAP authentication work?

A client sends a request for information stored in an LDAP database, along with the user's credentials, to an LDAP server. The server authenticates the submitted credentials against the user's core identity stored in the LDAP database. If they match, the client is granted access and receives the requested information. If not, access is denied.

## Configuring LDAP authentication on FortiGate

### 1. Add the LDAP server

Go to **User & Authentication → LDAP Servers** and select **Create New**.

- Enter a **Name** for the LDAP server.
- In **Server IP/Name**, enter the server's FQDN or IP address.
- If necessary, change the **Server Port**. The default is 389.
- Enter the **Common Name Identifier** (20 characters maximum). The default is `cn`, the common name, which is the display name on a Windows LDAP server.
- In **Bind Type**, select **Regular**.
- In **Username**, enter the LDAP administrator's name along with the domain (see the screenshot below).
- In **Password**, enter the LDAP administrator's password.
- For **Distinguished Name**, click **Browse** and select the main domain. (Do this after entering the username and password, otherwise browsing won't work.)
- Select **OK**.

![LDAP server settings](https://nztobuxccpkfigmxqqmb.supabase.co/storage/v1/object/public/media/migrated/2024/05/image-14-1024x698.png)

### 2. Import users from LDAP

Go to **User & Authentication → User Definition**, choose **Remote LDAP User** and click **Next**.

![Remote LDAP user](https://nztobuxccpkfigmxqqmb.supabase.co/storage/v1/object/public/media/migrated/2024/05/image-15-1024x626.png)

Choose your LDAP server.

![Choose LDAP server](https://nztobuxccpkfigmxqqmb.supabase.co/storage/v1/object/public/media/migrated/2024/05/image-16-1024x617.png)

You'll see all the users from the LDAP server. Select the users you need and click **Submit**. (I had already added my user, so there's no Submit button in the screenshot.)

![Select LDAP users](https://nztobuxccpkfigmxqqmb.supabase.co/storage/v1/object/public/media/migrated/2024/05/image-17-1024x478.png)

### 3. Create a user group

Now create a group for a department. I'm creating a group named **IT** containing the user "Abhimanyu Neupane" that I added previously. You can add more users to the group, but each one must first be added from the LDAP server to the FortiGate. Then select the LDAP server as the remote server for this group.

![User group](https://nztobuxccpkfigmxqqmb.supabase.co/storage/v1/object/public/media/migrated/2024/05/image-18-1024x689.png)

Click **OK**.

### 4. Configure SSL-VPN settings

Go to **VPN → SSL-VPN Settings** and specify the DNS server. Under **Authentication/Portal Mapping**, click **Create New**, add the group and select the **full-access** portal. The group and its portal now appear in the mapping. Select **Apply**.

![SSL-VPN settings](https://nztobuxccpkfigmxqqmb.supabase.co/storage/v1/object/public/media/migrated/2024/05/image-19-1024x709.png)

### 5. Create the firewall policy

Go to **Policy & Objects → Firewall Policy → Create New**.

- **Incoming interface:** SSL-VPN tunnel interface
- **Outgoing interface:** your internet link
- **Source:** the SSL-VPN address range plus the user group (here, the **IT** group created earlier)
- **Destination:** all
- **NAT:** enabled

Click **OK**.

![Firewall policy](https://nztobuxccpkfigmxqqmb.supabase.co/storage/v1/object/public/media/migrated/2024/05/image-20-1024x650.png)

![Policy list](https://nztobuxccpkfigmxqqmb.supabase.co/storage/v1/object/public/media/migrated/2024/05/image-21-1024x98.png)

### 6. Connect with FortiClient

Download FortiClient on your desktop and create a VPN connection using your public IP, then sign in with a username and password from the LDAP server.

![FortiClient setup](https://nztobuxccpkfigmxqqmb.supabase.co/storage/v1/object/public/media/migrated/2024/05/image-22.png)

You're now connected to the VPN using LDAP authentication.

![Connected](https://nztobuxccpkfigmxqqmb.supabase.co/storage/v1/object/public/media/migrated/2024/05/image-23.png)

Thank you so much!
