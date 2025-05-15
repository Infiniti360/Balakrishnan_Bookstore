from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud import crud_user
from app.core.config import settings

def check_superuser():
    db = next(get_db())
    try:
        user = crud_user.get_by_email(db, email=settings.FIRST_SUPERUSER)
        if user:
            print(f"Superuser exists: {user.email}")
            print(f"Is active: {user.is_active}")
            print(f"Is superuser: {user.is_superuser}")
        else:
            print("Superuser does not exist!")
    finally:
        db.close()

if __name__ == "__main__":
    check_superuser() 