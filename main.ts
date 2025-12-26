function getURLForId(id: string): string | null {
    if (id == "testing") {
        return "https://example.com"
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
