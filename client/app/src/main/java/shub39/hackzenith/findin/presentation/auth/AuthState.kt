package shub39.hackzenith.findin.presentation.auth

sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    data class Success(val userName: String?, val email: String?) : AuthState()
    data class Error(val message: String) : AuthState()
}