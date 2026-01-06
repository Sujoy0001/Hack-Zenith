package shub39.hackzenith.findin.di

import org.koin.core.module.dsl.viewModelOf
import org.koin.dsl.module
import shub39.hackzenith.findin.viewmodel.AuthViewModel

val modules = module {
    viewModelOf(::AuthViewModel)
}