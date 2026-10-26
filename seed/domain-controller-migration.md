Windows Server 2012 R2 is the seventh release of Microsoft's Windows Server operating system, part of the Windows NT family. It was released on October 18, 2013. It shipped with many great features, but technology moves on, and to keep our environment protected and supported we need to upgrade.

Microsoft ended extended support for Windows Server 2012 R2 on October 10, 2023, which means no more security updates. The solution is to migrate to Windows Server 2019.

---

A domain controller is **a server that responds to security authentication requests and verifies users on a network's domain**. It is the gatekeeper that allows hosts to access domain resources.

In this post we'll migrate a domain controller from Windows Server 2012 R2 to Windows Server 2019. The process has two main parts.

## 1. Prepare the existing AD forest with Adprep

First we prepare the 2012 R2 forest so it can support a Server 2019 domain controller.

Check the current schema version in the registry:

```
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\NTDS\Parameters
```

On 2012 R2 the **Schema Version** is **69**. Server 2019 requires schema version **88**, so we need to upgrade it.

To upgrade the schema, attach the Windows Server 2019 ISO and then:

1. Browse to `\support\adprep` on the ISO.
2. Open Command Prompt as administrator and change to that folder.
3. `adprep.exe /?` shows the help.
4. `adprep.exe /forestprep` upgrades the schema from 69 to 88. *Success: "Adprep successfully updated the forest-wide information."*
5. `adprep.exe /domainprep` updates the domain-wide information. *Success: "Adprep successfully updated the domain-wide information."*
6. `adprep.exe /domainprep /gpprep`. *Success: "Domain-wide information has already been updated" or "No GPO updates needed."*

Check the registry again and the Schema Version now reads 88.

## 2. Promote Server 2019 as an additional domain controller

1. Join the 2019 server to the domain.
2. Install the **Active Directory Domain Services** role.
3. Click **Promote this server to a domain controller**.
4. Select **Add a domain controller to an existing domain**, provide domain admin credentials and select the domain.
5. Keep **DNS server** and **Global Catalog** selected. Site name: **Default-First-Site-Name**. Provide a DSRM password.
6. Under replication, choose to replicate from an **existing domain controller**.
7. Complete the installation.

### Verify on the 2019 server

- In **Active Directory Users and Computers**, open the **Domain Controllers** OU. Both domain controllers should be listed.
- In the registry (`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\NTDS\Parameters`), **Schema Version** and **System Schema Version** should both read **88**.
- In **DNS Manager**, check **Forward Lookup Zones**. You should see two Active Directory-integrated primary zones running.
- In **Active Directory Sites and Services**, go to **Sites → Default-First-Site-Name → Servers**. Both servers should be there.
- Expand the 2019 server, right-click **NTDS Settings → All Tasks → Check Replication Topology**. You'll see an automatically generated connection from the 2012 R2 server; right-click it and choose **Replicate Now**.
- Repeat the same step on the 2012 R2 server.

### Confirm DNS replication

In DNS Manager on both servers, open each forward lookup zone and compare the **SOA serial number**. If it matches on both servers, all DNS records have replicated.

## 3. Transfer the FSMO roles to Server 2019

Check which server currently holds the FSMO roles:

```
netdom query fsmo
```

At this point the output lists **DC1** (our 2012 R2 domain controller) as the holder of all five roles.

### RID, PDC and Infrastructure masters

On the 2019 server, open **Active Directory Users and Computers**, right-click the domain and select **Operations Masters**. The current operations master is the 2012 R2 server. Click **Change** to transfer the role to 2019, then do the same on the **PDC** and **Infrastructure** tabs.

### Domain naming and schema masters

To transfer the remaining roles, open PowerShell as administrator on the 2019 server:

```
ntdsutil
roles
connections
connect to server <2019-server-name>
q
transfer naming master
transfer schema master
```

We connect to the 2019 server because that is where we want the roles to land. Type `help` at any prompt for the available commands, and confirm each transfer with **Yes**.

Run `netdom query fsmo` again. All five roles should now be held by the 2019 server.

We have successfully migrated the domain controller to Server 2019. The old domain controller can now be demoted.

## Bonus: renaming a domain controller

Say the old domain controller is `DC1.domain.com` and you want to rename it to `HODC1.domain.com`. Run these commands in order from an elevated command prompt.

**Step 1: Back up first.** Take a standard checkpoint if the DC is a virtual machine, or a full Windows backup if it's physical, so you can roll back if anything goes wrong. If there are multiple DCs in the domain, back up or checkpoint each one before starting.

**Step 2: Add an alternate computer name**

```
netdom computername DC1.domain.com /add:HODC1.domain.com
```

**Step 3: Make the new name primary**

```
netdom computername DC1.domain.com /makeprimary:HODC1.domain.com
```

**Step 4: Reboot**

```
shutdown /r /t 0
```

**Step 5: Remove the old name**

```
netdom computername HODC1.domain.com /remove:DC1.domain.com
```

**Step 6: Verify.** Check the event logs and run `dcdiag` for errors. Once you're happy the rename worked, remove or merge the checkpoints if it's a virtual machine.
