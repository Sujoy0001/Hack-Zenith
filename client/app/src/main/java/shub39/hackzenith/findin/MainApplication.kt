package shub39.hackzenith.findin

import android.app.Application
import com.google.firebase.FirebaseApp
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin
import shub39.hackzenith.findin.di.modules

class MainApplication: Application() {
    override fun onCreate() {
        super.onCreate()
        FirebaseApp.initializeApp(this)

        startKoin {
            androidContext(this@MainApplication)
            modules(modules)
        }
    }
}