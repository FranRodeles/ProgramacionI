import secrets
import string


def generate_unique_slug(model_class, length=8):
    """Genera un slug aleatorio y verifica que no exista en el modelo provisto."""
    alphabet = string.ascii_lowercase + string.digits
    while True:
        slug = "".join(secrets.choice(alphabet) for _ in range(length))
        if not model_class.objects.filter(slug=slug).exists():
            return slug
