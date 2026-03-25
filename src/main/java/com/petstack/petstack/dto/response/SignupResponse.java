package com.petstack.petstack.dto.response;

public class SignupResponse {
    private String email;
    private String displayName;

    public SignupResponse(String email, String displayName){
        this.email = email;
        this.displayName = displayName;
    }

    public String getEmail(){
        return this.email;
    }
    public String getDisplayName(){
        return this.displayName;
    }


}
