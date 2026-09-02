# Authentication

API requests act on behalf of a CEDAR account and follow that account's permissions. Log in to
CEDAR, open **Profile** from the person menu, and copy the API key shown there. For a long-running
project integration, use a dedicated project account rather than tying the workflow to one person's
account.

The key is sent in the `Authorization` header:

```text
Authorization: apiKey <YOUR_API_KEY>
```

The examples in this section use two shell variables so the key and server address do not have to
be repeated:

```bash
export CEDAR_API_KEY="<YOUR_API_KEY>"
export CEDAR_API="https://resource.metadatacenter.org"
```

Treat the API key as a password. Do not place it in source code or commit it to a repository.
