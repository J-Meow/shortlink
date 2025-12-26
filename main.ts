let config: {
    linkSource: "file" | undefined
    linkSourceFilePath: string | undefined
} = { linkSource: "file", linkSourceFilePath: "links.txt" }
try {
    const configFile = JSON.parse(Deno.readTextFileSync("shortlink.json"))
    console.log("Reading config file")
    config = { ...config, ...configFile }
} catch (_) {
    console.log("Error reading config file, using default settings")
}
const links: { [key: string]: string } = {}
const linkSource = "file"
if (linkSource == "file") {
    Deno.readTextFileSync("links.txt")
        .split("\n")
        .slice(0, -1)
        .forEach((link) => {
            const id = link.split("|")[0].trim()
            const url = link.split("|")[1].trim()
            links[id] = url
        })
    console.log(
        "Started up, found " +
            Object.keys(links).length +
            " link(s) from text file",
    )
} else {
    throw "Invalid link source"
}

function getURLForId(id: string): string | null {
    if (id in links) {
        return links[id]
    }
    return null
}

Deno.serve((req) => {
    const url = new URL(req.url)
    const id = url.pathname.slice(1).split("/")[0]
    if (id) {
        const redirectTo = getURLForId(id)
        if (redirectTo) {
            return new Response(null, {
                status: 301,
                headers: { location: redirectTo },
            })
        }
    }
    return new Response(null, { status: 404 })
})
