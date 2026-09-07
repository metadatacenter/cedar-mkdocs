// Capture helpers for the user guide's Sharing Resources page: the Groups page and the
// Permissions dialog. They write full-frame shots into docs/img/userguide/ and assume the
// caller (manual-run-sharing.mjs) has built the folder content they share and tears it down.
//
// Selectors anchor on ids and ng-click handlers rather than on text, the same way the
// e2e smoke in cedar-development/ops/e2e/login-smoke-test.mjs drives the same dialog.
import { BASE, SHARING } from './config.mjs';
import { gotoFolder, row, openRowMenu, menuItem, setCategoriesFilter } from './lib.mjs';
import { ug } from './manual-steps.mjs';

const SHARE_MODAL = '#share-modal .modal-content';
const PRINCIPAL_INPUT = '#share-principal';           // "User or group" typeahead
const ROLE_SELECT = '#share-role';                    // role for the principal being added
const ADD_BUTTON = 'button.share-add-button';
const ACCESS_ROW = '#shared-users .share-access-row'; // one row per owner and direct grant
const TYPEAHEAD_OPTION = 'ul.dropdown-menu:visible li';

const MORE_MENU = '#more-menu-dropdown-trigger';      // header ⋮ that lists Groups
const MANAGE_TAB = '#manage-groups-tab';
const CREATE_TAB = '#create-group-tab';
const GROUP_FINDER = '#group-selector';               // "Find a group" typeahead
const GROUP_NAME = '#group-name';                     // details form; present once a group is selected
const MEMBER_ROW = '.groups-member-row';
const NEW_GROUP_NAME = '#new-group-name';
const NEW_MEMBER = '#new-group-member';               // "Add a member" typeahead
const DELETE_GROUP = 'button.groups-delete-button';

const settle = (page, ms = 700) => page.waitForTimeout(ms);

// The green success toast, e.g. /has been created/.
async function toast(page, re) {
  await page.getByText(re).first().waitFor({ timeout: 20_000 });
}

// Toasts stay up for several seconds; wait them out before a shot they would clutter.
async function toastsGone(page) {
  await page.locator('.toast:visible').first().waitFor({ state: 'detached', timeout: 20_000 }).catch(() => {});
  await settle(page, 300);
}

// Type into a uib-typeahead and pick the option whose text contains `label`. An exact
// match selects itself (typeahead-select-on-exact), so a missing dropdown is not an
// error; the caller checks the control the selection enables.
async function pickTypeahead(page, input, text, label) {
  await input.fill('');
  await input.fill(text);
  const option = page.locator(TYPEAHEAD_OPTION).filter({ hasText: label }).first();
  await option.waitFor({ state: 'visible', timeout: 3000 }).then(() => option.click()).catch(() => {});
  await settle(page, 300);
}

// The sweetalert confirmation binds its handlers as it animates in (see confirmDelete in
// lib.mjs), so wait before clicking either button.
async function confirmButton(page, name) {
  const button = page.getByRole('button', { name, exact: true });
  await button.waitFor({ state: 'visible', timeout: 10_000 });
  await settle(page, 600);
  await button.click();
}

// ── Folder content ────────────────────────────────────────────────────────

// Create a folder inside `parentFolderId`, the same gesture as steps.mjs step1_folder but
// from within a folder. Verified by polling the listing, which can lag the create.
export async function createSubfolder(page, parentFolderId, name) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    await gotoFolder(page, parentFolderId);
    await page.getByRole('button', { name: 'New' }).click();
    await settle(page, 400);
    await menuItem(page, 'Folder');
    const dialog = page.getByRole('dialog').or(page.locator('.modal'));
    await dialog.getByRole('textbox').fill(name);
    await dialog.getByRole('button', { name: 'Save' }).click();
    for (let poll = 1; poll <= 6; poll++) {
      await gotoFolder(page, parentFolderId);
      await settle(page, 500);
      if (await row(page, name).count()) return;
      await settle(page, 1500);
    }
  }
  throw new Error(`folder "${name}" never appeared in its parent`);
}

// ── Groups page ───────────────────────────────────────────────────────────

async function gotoGroups(page) {
  await page.goto(`${BASE}/groups`, { waitUntil: 'domcontentloaded' });
  await page.locator(MANAGE_TAB).waitFor({ timeout: 20_000 });
  await settle(page);
}

// Select a group on the Manage tab. Returns false if no group by that name exists. An exact
// name selects itself as soon as it is typed; a partial one needs the option clicked.
async function findGroup(page, name) {
  await page.locator(MANAGE_TAB).click();
  await settle(page, 300);
  const finder = page.locator(GROUP_FINDER);
  await finder.fill('');
  await finder.fill(name);
  const option = page.locator(TYPEAHEAD_OPTION).filter({ hasText: name }).first();
  const selectedName = page.locator(GROUP_NAME);
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    if (await selectedName.count() && (await selectedName.inputValue()) === name) {
      await page.locator(MEMBER_ROW).first().waitFor({ timeout: 10_000 });
      await settle(page);
      return true;
    }
    if (await option.isVisible().catch(() => false)) await option.click().catch(() => {});
    await settle(page, 200);
  }
  return false;
}

// Delete the group by name if it exists (a leftover from an interrupted run, or teardown).
export async function deleteGroup(page, name = SHARING.groupName) {
  await gotoGroups(page);
  if (!(await findGroup(page, name))) return false;
  await page.locator(DELETE_GROUP).click();
  await confirmButton(page, 'Remove');
  await toast(page, /has been deleted/i);
  return true;
}

// The header ⋮ menu that leads to the Groups page, then the page itself: create the group,
// add the collaborator, and show the result from the Manage tab.
export async function captureGroups(page, folderId) {
  await gotoFolder(page, folderId);
  await setCategoriesFilter(page, false);
  await settle(page);
  await page.locator(MORE_MENU).click();
  await settle(page, 500);
  await ug(page, 'header-more-menu');
  await page.keyboard.press('Escape').catch(() => {});

  await deleteGroup(page); // idempotent re-runs: the name must be free
  await gotoGroups(page);
  await page.locator(CREATE_TAB).click();
  await settle(page, 300);
  await page.locator(NEW_GROUP_NAME).fill(SHARING.groupName);
  await settle(page, 300);
  await ug(page, 'groups-create');
  await page.getByRole('button', { name: 'Create group', exact: true }).click();
  await toast(page, /has been created/i);
  await page.locator(NEW_MEMBER).waitFor({ timeout: 10_000 });
  await settle(page);

  await pickTypeahead(page, page.locator(NEW_MEMBER), SHARING.collaborator.split(' ')[0], SHARING.collaborator);
  const addMember = page.getByRole('button', { name: 'Add member' });
  if (await addMember.isDisabled()) throw new Error(`the member picker did not offer ${SHARING.collaborator}`);
  await addMember.click();
  await toast(page, /has been updated/i);

  // Show the finished group from the Manage tab, the view a user returns to.
  if (!(await findGroup(page, SHARING.groupName))) throw new Error('the created group was not offered by Find a group');
  await toastsGone(page);
  await page.mouse.move(40, 600); // no tooltip in the shot
  await ug(page, 'groups-manage');
}

// ── Permissions dialog ────────────────────────────────────────────────────

async function openPermissions(page, folderId, title, menuShot) {
  await gotoFolder(page, folderId);
  await setCategoriesFilter(page, false);
  await settle(page);
  await openRowMenu(page, title);
  if (menuShot) await ug(page, menuShot);
  await row(page, title).locator('a.share:visible').first().click();
  const modal = page.locator(SHARE_MODAL);
  await modal.waitFor({ state: 'visible', timeout: 15_000 });
  await modal.locator(PRINCIPAL_INPUT).waitFor({ state: 'visible', timeout: 15_000 });
  await settle(page, 1200); // users, groups and the access report load after the dialog opens
  return modal;
}

// Add one principal with a role and wait for the server to record it.
async function grant(page, modal, name, role) {
  await pickTypeahead(page, modal.locator(PRINCIPAL_INPUT), name, name);
  const add = modal.locator(ADD_BUTTON);
  if (await add.isDisabled()) throw new Error(`the permissions dialog did not offer ${name}`);
  if (role) await modal.locator(ROLE_SELECT).selectOption(role);
  const saved = page.waitForResponse(r => r.request().method() === 'PUT' && /\/permissions(\?|$)/.test(r.url()),
    { timeout: 20_000 });
  await add.click();
  await saved;
  await settle(page, 500);
}

// The same dialog on a template, which carries no folder notice because a template contains
// nothing. Grants one user and one group so the table shows both principal kinds.
export async function captureTemplatePermissions(page, folderId, templateName) {
  const modal = await openPermissions(page, folderId, templateName);
  await grant(page, modal, SHARING.collaborator, 'editor');
  await grant(page, modal, SHARING.groupName, 'viewer');
  await toastsGone(page);
  await ug(page, 'permissions-dialog-template');
  await modal.getByRole('button', { name: 'Done' }).click();
  await modal.waitFor({ state: 'hidden', timeout: 10_000 });
}

// The dialog on a folder inside the run folder: as opened, while adding a user, with three
// grants, and the ownership-transfer confirmation (cancelled).
export async function captureFolderPermissions(page, folderId, subfolderName) {
  const modal = await openPermissions(page, folderId, subfolderName, 'permissions-menu');
  await ug(page, 'permissions-dialog');

  // Matches appear while typing; capture the list before choosing.
  const input = modal.locator(PRINCIPAL_INPUT);
  await input.fill(SHARING.collaborator.split(' ')[0]);
  await page.locator(TYPEAHEAD_OPTION).first().waitFor({ state: 'visible', timeout: 5000 });
  await ug(page, 'permissions-add-user');
  await grant(page, modal, SHARING.collaborator, 'editor');
  await grant(page, modal, SHARING.groupName, 'viewer');
  await grant(page, modal, 'Everyone', null); // the built-in group can only be a Viewer
  await toastsGone(page);
  await ug(page, 'permissions-access-list');

  // Ownership transfer asks for confirmation; capture it and cancel.
  const collaboratorRow = modal.locator(ACCESS_ROW).filter({ hasText: SHARING.collaborator }).first();
  await collaboratorRow.locator('.share-owner-cell input').click();
  await page.getByText('Transfer ownership?').waitFor({ timeout: 10_000 });
  await settle(page, 600);
  await ug(page, 'permissions-transfer-ownership');
  await confirmButton(page, 'Cancel');
  await settle(page, 500);

  await modal.getByRole('button', { name: 'Done' }).click();
  await modal.waitFor({ state: 'hidden', timeout: 10_000 });
}
