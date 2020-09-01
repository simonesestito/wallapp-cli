
# WallApp CLI Manager

This is a Command-Line utility to manage all of wallpapers in WallApp collection.

It is intended for internal-use only, in fact it doesn't contain the secret private Firebase Admin key. 

This software is part of WallApp repositories:
- [WallApp Android](https://github.com/simonesestito/wallapp-android)
- [WallApp iOS](https://github.com/paoloGiubilato/wallApp)
- [WallApp Web](https://github.com/simonesestito/wallapp-web)

## Tecnologies used

- Firebase Admin SDK
- Node JS

## How to use (for internals)

- Copy the Firebase private key at <code>src/secret/firebase-admin.json</code>;
- Install Node.js on your machine;
- Finally, run <code>npm start</code> to start the app. All dependencies will be automatically installed using your favourite package manager (npm or yarn) and it will also be built with Babel.

## License
    Copyright 2018-2020 Simone Sestito

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
