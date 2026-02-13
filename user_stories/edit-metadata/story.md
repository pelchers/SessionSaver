# User Story Validation Template

## Story

- Title: Edit session metadata
- Owner: product
- Role: As a user
- Goal: I want to rename sessions and add descriptions so they are meaningful later
- Scope: MVP

## Steps

1) Open a saved session detail page.
2) Rename the session in the header.
3) Edit the description and leave the field (blur).
4) Navigate back to library.

## Expected Results

- New name appears in header and library list.
- Description preview in library reflects the updated description.
- Changes persist after closing/reopening UI.

## Edge Cases

- Name with leading/trailing whitespace is trimmed.
- Description with multi-line and symbol-heavy content saves without corruption.
- Blur-save and explicit save button should not race or overwrite each other.

## Evidence

- Screenshots: /user_stories/edit-metadata/validation/
- Notes: validation.md
