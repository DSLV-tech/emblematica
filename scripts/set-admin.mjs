#!/usr/bin/env node
/**
 * set-admin.mjs
 * 
 * Run this ONCE from the terminal to promote a user to 'admin' in Firestore.
 * Requires the Firebase Admin SDK and a service account key.
 * 
 * Setup:
 *   1. Go to Firebase Console → Project Settings → Service Accounts
 *   2. Click "Generate new private key" → save as `service-account.json` in project root
 *      (NEVER commit service-account.json to git!)
 *   3. npm install firebase-admin  (already in devDependencies if present)
 * 
 * Usage:
 *   node scripts/set-admin.mjs <userEmail>
 * 
 * Example:
 *   node scripts/set-admin.mjs cristian.disalvo@gmail.com
 */

import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const email = process.argv[2]
if (!email) {
    console.error('❌  Usage: node scripts/set-admin.mjs <userEmail>')
    process.exit(1)
}

// Load service account — adjust path if needed
const serviceAccountPath = resolve(process.cwd(), 'service-account.json')
let serviceAccount
try {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
} catch {
    console.error('❌  Could not read service-account.json — see instructions at the top of this file.')
    process.exit(1)
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
const auth = admin.auth()

async function promoteToAdmin(targetEmail) {
    console.log(`🔍  Looking up user: ${targetEmail}`)
    let userRecord
    try {
        userRecord = await auth.getUserByEmail(targetEmail)
    } catch {
        console.error(`❌  No Firebase Auth user found with email: ${targetEmail}`)
        console.log('    Make sure the user has logged in at least once before running this script.')
        process.exit(1)
    }

    const uid = userRecord.uid
    console.log(`✅  Found user: ${userRecord.displayName ?? 'N/A'} (uid: ${uid})`)

    const userRef = db.collection('users').doc(uid)
    await userRef.set(
        {
            role: 'admin',
            promotedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
    )

    console.log(`🎉  Successfully promoted ${targetEmail} to admin!`)
    console.log(`    They will see admin controls on their next login.`)
    process.exit(0)
}

promoteToAdmin(email).catch((err) => {
    console.error('❌  Unexpected error:', err)
    process.exit(1)
})
