from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet, LogoutView

app_name = "users"

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="users")

urlpatterns = [
    path("", include(router.urls)),
    path("profile/", UserViewSet.as_view({"get": "profile", "patch": "profile"}), name="profile"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
