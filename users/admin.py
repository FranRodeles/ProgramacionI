from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from users.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "role", "is_staff", "created_at")
    list_filter = ("role", "is_staff", "is_active", "created_at")
    search_fields = ("username", "email")
    ordering = ("-created_at",)

    fieldsets = BaseUserAdmin.fieldsets + (
        ("Extra info", {"fields": ("role", "created_at", "updated_at")}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Extra info", {"fields": ("role",)}),
    )
    readonly_fields = ("created_at", "updated_at")
