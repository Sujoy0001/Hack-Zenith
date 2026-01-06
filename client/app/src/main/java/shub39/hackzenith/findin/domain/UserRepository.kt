package shub39.hackzenith.findin.domain

import kotlin.Result

interface UserRepository {
    fun getCurrentUserId(): String?
    suspend fun createUser(
        user: String,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    )
    suspend fun signOut(): Result<Unit>
    suspend fun getCurrentUser(): String?
    suspend fun validateBatchCode(code: String): Result<String>
}