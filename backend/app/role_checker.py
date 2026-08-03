from fastapi import Depends, HTTPException, status

from app.dependencies import get_current_user


def require_role(required_role: str):

    def role_checker(current_user=Depends(get_current_user)):

        if current_user.role.role_name.lower() != required_role.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to perform this action."
            )

        return current_user

    return role_checker