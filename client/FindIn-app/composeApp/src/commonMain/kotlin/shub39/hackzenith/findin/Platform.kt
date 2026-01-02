package shub39.hackzenith.findin

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform