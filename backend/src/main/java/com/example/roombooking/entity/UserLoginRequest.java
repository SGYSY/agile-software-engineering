package com.example.roombooking.entity;

import jakarta.persistence.Entity;
import lombok.Data;

import java.io.Serializable;
@Data
public class UserLoginRequest implements Serializable {
    private static final long serialVersionUID = -3611163626861594915L;
    private String userAccount;
    private String userPassword;

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getUserAccount() {
        return userAccount;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserAccount(String userAccount) {
        this.userAccount = userAccount;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }
}
