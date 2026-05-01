#include <iostream>
#include <luna-service2/lunaservice.h>
#include <pmloglib.h>
#include <glib.h>

/**
 * Nota: Aplicações "puramente C++" no webOS geralmente são serviços ou 
 * usam SDL/OpenGL para interface gráfica.
 * Este é um esqueleto básico de uma aplicação nativa que se comunica com o sistema.
 */

PmLogContext getContext() {
    static PmLogContext context = nullptr;
    if (!context) {
        PmLogGetContext("AmaroApp", &context);
    }
    return context;
}

int main(int argc, char* argv[]) {
    PmLogInfo(getContext(), "APP_START", 0, "Iniciando Aplicativo Nativo do Amaro");

    GMainLoop* loop = g_main_loop_new(NULL, FALSE);

    // No webOS, para exibir algo na tela em C++, você usaria SDL2 ou OpenGL.
    // Como você quer "Bem-vindo Amaro", aqui estaria a lógica de renderização.
    
    std::cout << "Bem-vindo Amaro! Aplicativo Nativo rodando." << std::endl;

    // O loop mantém o app vivo na TV
    g_main_loop_run(loop);

    g_main_loop_unref(loop);
    return 0;
}
