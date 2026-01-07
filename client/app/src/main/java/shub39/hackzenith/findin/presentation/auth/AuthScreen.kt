package shub39.hackzenith.findin.presentation.auth

import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.common.api.ApiException
import org.koin.compose.viewmodel.koinViewModel
import shub39.hackzenith.findin.viewmodel.AuthViewModel

@Composable
fun SignInScreen(
    viewModel: AuthViewModel = koinViewModel()
) {
    val context = LocalContext.current

    val signInLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
        try {
            val account = task.getResult(ApiException::class.java)
            viewModel.handleSignInResult(account)
        } catch (e: ApiException) {
            viewModel.handleSignInResult(null)
        }
    }

    // Handle auth state changes
    LaunchedEffect(viewModel.authState) {
        when (val state = viewModel.authState) {
            is AuthState.Success -> {
                Toast.makeText(
                    context,
                    "Welcome ${state.userName}",
                    Toast.LENGTH_SHORT
                ).show()
            }
            is AuthState.Error -> {
                Toast.makeText(
                    context,
                    state.message,
                    Toast.LENGTH_SHORT
                ).show()
                viewModel.resetAuthState()
            }
            else -> {}
        }
    }

    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        when (val state = viewModel.authState) {
            is AuthState.Loading -> {
                CircularProgressIndicator()
            }

            is AuthState.Success -> {
                SignedInContent(
                    userName = state.userName,
                    email = state.email,
                    onSignOut = { viewModel.signOut() }
                )
            }

            else -> {
                SignInContent(
                    onSignInClick = {
                        val signInIntent = viewModel.googleSignInClient.signInIntent
                        signInLauncher.launch(signInIntent)
                    }
                )
            }
        }
    }
}

@Composable
fun SignInContent(onSignInClick: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier.padding(16.dp)
    ) {
        Text(
            text = "Welcome!",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        Button(
            onClick = onSignInClick,
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Text("Sign in with Google")
        }
    }
}

@Composable
fun SignedInContent(
    userName: String?,
    email: String?,
    onSignOut: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier.padding(16.dp)
    ) {
        Text(
            text = "Signed In",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        Text(
            text = "Name: ${userName ?: "N/A"}",
            style = MaterialTheme.typography.bodyLarge,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Text(
            text = "Email: ${email ?: "N/A"}",
            style = MaterialTheme.typography.bodyMedium,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        OutlinedButton(
            onClick = onSignOut,
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Text("Sign Out")
        }
    }
}