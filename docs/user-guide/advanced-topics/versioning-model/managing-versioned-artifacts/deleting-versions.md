# Deleting Versions

Publication protects content from ordinary editing, but does not make it permanent. Users with
[deletion permission](../../permission-model/index.md) can delete both draft and published versions.
Other deletion preconditions still apply, including restrictions on deleting a template used by
stored instances.

Deleting a version reconnects its successor to the deleted version's predecessor. If there is no
surviving predecessor, the successor has no `pav:previousVersion` property. For example, deleting B
from A → B → C leaves A → C. Deleting A from A → B leaves B without a predecessor. This rule applies
even when the successor is published: CEDAR maintains the history link without changing the
successor's content, identifier, version number, publication status or provenance timestamps.

The surviving versions remain one series:

| Deleted Version | Result |
|---|---|
| The draft | The newest surviving published version becomes latest and can produce another draft. |
| The newest published version, while a draft exists | The draft remains latest. The next newest surviving published version becomes the current release. |
| The newest published version, with no draft | The next newest surviving published version becomes latest and can produce another draft. |
| An older version | The current draft and release remain unchanged; the history links reconnect around the deletion. |
| The only surviving version | The series has no current artifact. |

A series with a draft and no surviving published version shows only its draft. Deleting a version
never moves existing instances to another template or replaces definitions embedded in other
artifacts. The document and search projections may briefly lag the graph while a failed update is
retried; the server records the work so it can resume after a restart.
