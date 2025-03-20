package com.example.roombooking.entity;

import lombok.Data;

import java.io.Serializable;
@Data
public class UserRegisterRequest implements Serializable {
    private static final long serialVersionUID = -1489553408188404787L;
    private String userAccount;
    private String userPassword;
    private String checkPassword;

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }
    public UserRegisterRequest() {

    }
    public String getUserAccount() {
        return userAccount;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public String getCheckPassword() {
        return checkPassword;
    }

    public void setCheckPassword(String checkPassword) {
        this.checkPassword = checkPassword;
    }

    public void setUserAccount(String userAccount) {
        this.userAccount = userAccount;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }
}
