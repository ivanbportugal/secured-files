# Secured Files

Hosts files from a secured (JWT) endpoint. Front End included.

# Tech Stack

## Back End

NodeJS, KoaJS, JWT, flat file for users (no database)

## Front End

React (create-react-app), AntD

# Architecture

- The client is built and deployed to a static directory, hosted in the koajs app to avoid any CORS issues.
- To list or view any files (read-only), you must use a JWT token.
- The client is intended to view pictures (jpg) and videos (mp4) directly in the browser - no downloads.
- The client needs to be an installable PWA for quick access.

# Future

- Monitor files as the come in, notify authenticated clients via websocket.
