# User Story Validation Template

## Story

- Title: Save session
- Owner: product
- Role: As a user
- Goal: I want to save my current windows, tab groups, and tabs as a named session
- Scope: MVP

## Steps

1) Open the extension library UI.
2) Click `Save Current Session`.
3) Enter a session name and click `Save Session`.

## Expected Results

- A new session appears in the library list immediately.
- The session shows non-zero window/tab counts matching the current browser state.
- The session has correct timestamps (created/updated).

## Edge Cases

- User enters only whitespace for `Name`: save must fail with clear validation.
- User enters long descriptions with punctuation/newlines: save must still succeed.
- Save is clicked twice quickly: only one new row should appear per accepted request.

## Evidence

- Screenshots: /user_stories/save-session/validation/
- Notes: validation.md
