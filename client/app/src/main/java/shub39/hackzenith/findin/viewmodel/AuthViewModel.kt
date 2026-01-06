package shub39.hackzenith.findin.viewmodel

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import shub39.hackzenith.findin.R
import shub39.hackzenith.findin.presentation.auth.AuthState

class AuthViewModel(application: Application) : AndroidViewModel(application) {

    private val _authState = MutableStateFlow<AuthState>(AuthState.Idle)
    var authState = _authState.asStateFlow()
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            AuthState.Idle
        )

    private val auth: FirebaseAuth = Firebase.auth
    val googleSignInClient: GoogleSignInClient

    init {
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(application.getString(R.string.default_web_client_id))
            .requestEmail()
            .build()

        googleSignInClient = GoogleSignIn.getClient(application, gso)

        // Check if user is already signed in
        checkAuthState()
    }

    private fun checkAuthState() {
        val currentUser = auth.currentUser
        _authState.update {
            if (currentUser != null) {
                AuthState.Success(currentUser.displayName, currentUser.email)
            } else {
                AuthState.Idle
            }
        }
    }

    fun handleSignInResult(account: GoogleSignInAccount?) {
        if (account != null) {
            _authState.update { AuthState.Loading }
            firebaseAuthWithGoogle(account.idToken!!)
        } else {
            _authState.update { AuthState.Error("Authentication failed") }
        }
    }

    private fun firebaseAuthWithGoogle(idToken: String) {
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        auth.signInWithCredential(credential)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    Log.d(TAG, "signInWithCredential:success")
                    val user = auth.currentUser
                    _authState.update { AuthState.Success(user?.displayName, user?.email) }
                } else {
                    Log.w(TAG, "signInWithCredential:failure", task.exception)
                    _authState.update { AuthState.Error("Authentication failed") }
                }
            }
    }

    fun signOut() {
        auth.signOut()
        googleSignInClient.signOut()
        _authState.update { AuthState.Idle }
    }

    fun resetAuthState() {
        _authState.update { AuthState.Idle }
    }

    companion object {
        private const val TAG = "AuthViewModel"
    }
}