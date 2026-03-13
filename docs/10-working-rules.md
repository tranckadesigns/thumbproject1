# Working Rules

## Core Working Method
1. read docs
2. confirm current phase
3. implement only requested phase scope
4. preserve unrelated code
5. summarize what changed

## Direction vs Freedom

The docs define:
- product direction
- scope
- architecture direction
- quality standards
- visual character

Within those constraints, make strong implementation decisions.

## Critical Delivery Rule

Do not let missing external integrations block progress.

Where needed, create:
- mocks
- placeholders
- local services
- demo states
- adapter boundaries

## Code Rules
- keep files modular
- avoid massive page files
- separate UI from data logic
- separate mocks from components
- build with future replacement in mind
