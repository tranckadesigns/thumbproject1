# Data Model

## Goal

The app should model the final real product, even when using mock data first.

## Main Entities

### profile
- id
- email
- full_name
- role
- subscription_status
- plan_type

### asset
- id
- slug
- title
- short_description
- full_description
- category
- platform_type
- style_type
- thumbnail_url
- preview_images
- psd_file_key
- file_size_mb
- version
- is_featured
- is_published
- tags

### favorite
- id
- user_id
- asset_id

### download
- id
- user_id
- asset_id
- downloaded_at

## Modeling Rule

Even if the app starts with local mock arrays or JSON-backed mocks, the shape should mirror the intended real entities so migration later is easy.
