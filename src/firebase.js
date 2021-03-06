/*
 * This file is part of WallApp CLI Manager.
 * Copyright (C) 2018  Simone Sestito
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as admin from "firebase-admin";
const serviceAccount = require("../secrets/firebase-admin.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wallapp-b7805.firebaseio.com",
  storageBucket: "wallapp-b7805.appspot.com"
});

const storage = admin.storage().bucket();
const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

export { storage, firestore };

export const BASE_FIREBASE_STORAGE_CONSOLE_URL = `https://console.firebase.google.com/u/0/project/${serviceAccount.project_id}/storage/${app.options.storageBucket}/files`;
