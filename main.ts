const links: { [key: string]: string } = {}
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
