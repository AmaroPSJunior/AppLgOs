cmake_minimum_required(VERSION 3.5)
project(AmaroNativeApp)

set(CMAKE_CXX_STANDARD 11)

# Localização do NDK/SDK do webOS (geralmente passados pelo ambiente de build)
find_package(PkgConfig REQUIRED)
pkg_check_modules(LUNA_SERVICE REQUIRED luna-service2)
pkg_check_modules(PMLOG REQUIRED PmLogLib)

add_executable(native_app src/main.cpp)

target_include_directories(native_app PUBLIC
    ${LUNA_SERVICE_INCLUDE_DIRS}
    ${PMLOG_INCLUDE_DIRS}
)

target_link_libraries(native_app
    ${LUNA_SERVICE_LIBRARIES}
    ${PMLOG_LIBRARIES}
)
