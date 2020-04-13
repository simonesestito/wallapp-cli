
# WallApp CLI Manager

This is a Command-Line utility to manage all of wallpapers in WallApp collection.

It is intended for internal-use only, in fact it doesn't contain the secret private Firebase Admin key. 

This software is part of WallApp repositories:
- [WallApp Android](https://github.com/simonesestito/wallapp-android)
- [WallApp iOS](https://github.com/paoloGiubilato/wallApp)
- [WallApp Web](https://github.com/simonesestito/wallapp-web)

## Tecnologies used

- TypeScript
- Firebase Admin SDK
- Node JS

## Installation and setup (for WallApp admins)

- Install Node.js, NPM and Git on your machine
- Open a new terminal window
- Clone this repo: <code>git clone https://github.com/simonesestito/wallapp-cli --depth 1</code>
- Open cloned project: <code>cd wallapp-cli</code>
- Copy both your **Firebase admin** and **Scaleway config** JSON files inside <code>secrets/</code> folder
- Install project dependecies: <code>npm install</code>
- Build the project: <code>npm run build</code>
- _[optional]_ Remove unnecessary dependencies to save storage space on your PC: <code>npm prune --production</code>

## How to start the app (for WallApp admins)

After having done all the steps above, you're good to go.
Launch the app with the following command (inside cloned _wallapp-cli_ folder):

`node dist`

## License
    Copyright 2020 Simone Sestito

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
