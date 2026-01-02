package shub39.hackzenith.findin

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "FindIn-app",
    ) {
        App()
    }
}