# Subdomains

Our utility script will add the subdomains needed for CEDAR Docker into the local `/etc/hosts` file.

Please run:
```sh
cedarcli dev add-hosts
```

The script will ask you for your password to execute a `sudo`.
The output of the script should be similar to the one below:

```
Testing the list of CEDAR hosts:
Host unknown : artifact.metadatacenter.orgx
Host unknown : artifacts.metadatacenter.orgx
Host unknown : bridge.metadatacenter.orgx
Host unknown : bridging.metadatacenter.orgx
Host unknown : auth.metadatacenter.orgx
Host unknown : cedar.metadatacenter.orgx
Host unknown : content.metadatacenter.orgx
Host unknown : group.metadatacenter.orgx
Host unknown : impex.metadatacenter.orgx
Host unknown : monitor.metadatacenter.orgx
Host unknown : monitoring.metadatacenter.orgx
Host unknown : messaging.metadatacenter.orgx
Host unknown : open.metadatacenter.orgx
Host unknown : openview.metadatacenter.orgx
Host unknown : repo.metadatacenter.orgx
Host unknown : resource.metadatacenter.orgx
Host unknown : schema.metadatacenter.orgx
Host unknown : submission.metadatacenter.orgx
Host unknown : terminology.metadatacenter.orgx
Host unknown : user.metadatacenter.orgx
Host unknown : valuerecommender.metadatacenter.orgx
Host unknown : worker.metadatacenter.orgx
Host unknown : demo.cee.metadatacenter.orgx
Host unknown : demo-dist.cee.metadatacenter.orgx
Host unknown : docs.cee.metadatacenter.orgx
Host unknown : docs-dist.cee.metadatacenter.orgx
Some CEDAR hosts are unknown, we will prompt for your password in order to make modifications to /etc/hosts !
Password:
Host unknown, adding to /etc/hosts: artifact.metadatacenter.orgx
Host unknown, adding to /etc/hosts: artifacts.metadatacenter.orgx
Host unknown, adding to /etc/hosts: bridge.metadatacenter.orgx
Host unknown, adding to /etc/hosts: bridging.metadatacenter.orgx
Host unknown, adding to /etc/hosts: auth.metadatacenter.orgx
Host unknown, adding to /etc/hosts: cedar.metadatacenter.orgx
Host unknown, adding to /etc/hosts: content.metadatacenter.orgx
Host unknown, adding to /etc/hosts: group.metadatacenter.orgx
Host unknown, adding to /etc/hosts: impex.metadatacenter.orgx
Host unknown, adding to /etc/hosts: monitor.metadatacenter.orgx
Host unknown, adding to /etc/hosts: monitoring.metadatacenter.orgx
Host unknown, adding to /etc/hosts: messaging.metadatacenter.orgx
Host unknown, adding to /etc/hosts: open.metadatacenter.orgx
Host unknown, adding to /etc/hosts: openview.metadatacenter.orgx
Host unknown, adding to /etc/hosts: repo.metadatacenter.orgx
Host unknown, adding to /etc/hosts: resource.metadatacenter.orgx
Host unknown, adding to /etc/hosts: schema.metadatacenter.orgx
Host unknown, adding to /etc/hosts: submission.metadatacenter.orgx
Host unknown, adding to /etc/hosts: terminology.metadatacenter.orgx
Host unknown, adding to /etc/hosts: user.metadatacenter.orgx
Host unknown, adding to /etc/hosts: valuerecommender.metadatacenter.orgx
Host unknown, adding to /etc/hosts: worker.metadatacenter.orgx
Host unknown, adding to /etc/hosts: demo.cee.metadatacenter.orgx
Host unknown, adding to /etc/hosts: demo-dist.cee.metadatacenter.orgx
Host unknown, adding to /etc/hosts: docs.cee.metadatacenter.orgx
Host unknown, adding to /etc/hosts: docs-dist.cee.metadatacenter.orgx
```
