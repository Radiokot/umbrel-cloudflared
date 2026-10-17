import { error, json } from "@sveltejs/kit";
import { constants as fsConstants, promises as fsPromises } from "fs";

import TunnelSettings from "$lib/model/TunnelSettings";
import { env } from "$env/dynamic/private";

const VALUE_FILE_ENCODING = "utf8";
const CLOUDFLARED_CONTROL_URL =
    "http://" + env.CLOUDFLARED_HOSTNAME + ":" + 8018;

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const token = await getValueFromFile(env.CLOUDFLARED_TOKEN_FILE!);
    const extraArgs = await getValueFromFile(env.CLOUDFLARED_EXTRA_ARGS_FILE!);
    return json(new TunnelSettings(token, extraArgs));
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { token, extraArgs } = await request.json();
    if (token && typeof token == "string") {
        await saveValueToFile(token, env.CLOUDFLARED_TOKEN_FILE!);
    } else {
        throw error(400, '"token" is required and must be a string');
    }

    if (extraArgs && typeof extraArgs == "string") {
        await saveValueToFile(extraArgs, env.CLOUDFLARED_EXTRA_ARGS_FILE!);
    } else {
        await saveValueToFile("", env.CLOUDFLARED_EXTRA_ARGS_FILE!);
    }

    await restartConnector();

    return GET();
}

async function getValueFromFile(file: string): Promise<string | null> {
    let fileHandle;
    try {
        try {
            await fsPromises.access(file, fsConstants.R_OK);
        } catch (err) {
            console.warn("settings.getValueFromFile: file_not_accessible:", {
                message: (err as Error).message,
                file: file,
            });

            return null;
        }

        fileHandle = await fsPromises.open(file, "r");
        return (await fileHandle.readFile(VALUE_FILE_ENCODING)).trim();
    } finally {
        if (fileHandle !== undefined) {
            await fileHandle.close();
        }
    }
}

/**
 * @param token value to save
 */
async function saveValueToFile(value: string, file: string) {
    let fileHandle;
    try {
        fileHandle = await fsPromises.open(file, "w");
        await fileHandle.writeFile(value, {
            encoding: VALUE_FILE_ENCODING,
            flag: "w",
        });
    } finally {
        if (fileHandle !== undefined) {
            await fileHandle.close();
        }
    }
}

async function restartConnector() {
    const response = await fetch(CLOUDFLARED_CONTROL_URL + "/cfd-restart", {
        method: "POST",
    });

    if (response.status != 202) {
        console.error("settings.restartConnector: unexpected_response", {
            status: response.status,
        });

        throw new Error(
            "Unexpected response from the restart: " + response.status,
        );
    }
}
