package com.example.howtodoinjava.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import own.*;
import javafx.util.Pair;
import java.util.*;
import java.util.Random;

@Endpoint
public class MailEndpoint
{
    private static final String NAMESPACE_URI = "own";
    static List< Pair<String, String> > Ids = new ArrayList<>(); // pair<id,username>
    static Random rand = new Random();
    private final static Object snc = new Object();
    private int[] C = {(int)'0', (int)'A', (int)'a'};
    private int[] L = {10, 26, 26};

    @Autowired
    public MailEndpoint() {

    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "LoginRequest")
    @ResponsePayload
    public LoginResponse Login(@RequestPayload LoginRequest request) {
        LoginResponse response = new LoginResponse();

        response.setResult("Username or password is incorrect");
        response.setId("-1");

        if(DB.checkUser(request.getUsername())){
            int tmp1 = DB.checkUserPassword(request.getUsername(),request.getPassword());

            if(tmp1 == 1  ||  tmp1 == 2) {
                String tmp2 = GetId(request.getUsername());

                if(tmp2 != null){
                    response.setResult("There is other client logged in with this username");
                    response.setId("-1");
                }
                else {
                    response.setResult(String.valueOf(tmp1));
                    response.setId(GenerateString(request.getUsername()));
                }
            }
        }

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "WriteMessageRequest")
    @ResponsePayload
    public WriteMessageResponse WriteMessage(@RequestPayload WriteMessageRequest request) {
        WriteMessageResponse response = new WriteMessageResponse();

        String username = GetUserName(request.getId());

        if(null == username  ||  !DB.checkUser(username)){
            response.setResult("Please log in to use this operation");
        }
        else{
            if(!DB.checkUser(request.getTo()))
                response.setResult("There is no such user");
            else {
                response.setResult("The message has been successfully sent");

                if(!DB.addMessage(username, request.getTo(), request.getMessage()))
                    response.setResult("There is unknown error on server");
            }
        }

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "ReadInboxRequest")
    @ResponsePayload
    public ReadResponse ReadInbox(@RequestPayload ReadInboxRequest request) {
        ReadResponse response = new ReadResponse();

        String username = GetUserName(request.getId());

        if(null == username  ||  !DB.checkUser(username)){
            response.setCount(-1);
            response.setResult("Please log in to use this operation");
        }
        else {
            response = DB.readMessage(username, "in");
        }

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "ReadOutboxRequest")
    @ResponsePayload
    public ReadResponse ReadOutbox(@RequestPayload ReadOutboxRequest request) {
        ReadResponse response = new ReadResponse();

        String username = GetUserName(request.getId());

        if(null == username  ||  !DB.checkUser(username)){
            response.setCount(-1);
            response.setResult("Please log in to use this operation");
        }
        else {
            response = DB.readMessage(username, "out");
        }

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "ReadInfoRequest")
    @ResponsePayload
    public ReadInfoResponse ReadInfo(@RequestPayload ReadInfoRequest request) {
        ReadInfoResponse response = new ReadInfoResponse();

        String username = GetUserName(request.getId());

        if(null == username  ||  !DB.checkUser(username)){
            response.setResult("Please log in to use this operation");
        }
        else if(!DB.IsAdmin(username))
            response.setResult("It is not allowed operation");
        else {
            if(DB.checkUser(request.getUsername())) {
                response.setUser(DB.readUser(request.getUsername()));
                response.setResult("Done");
            }
            else
                response.setResult("There is no such user");
        }

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "DeleteUserRequest")
    @ResponsePayload
    public DeleteUserResponse DeleteUser(@RequestPayload DeleteUserRequest request) {
        DeleteUserResponse response = new DeleteUserResponse();

        String username = GetUserName(request.getId());

        if(null == username  ||  !DB.checkUser(username)){
            response.setResult("Please log in to use this operation");
        }
        else if(!DB.IsAdmin(username))
            response.setResult("It is not allowed operation");
        else {
            if(DB.checkUser(request.getUsername())) {
                if(DB.deleteUser(request.getUsername()))
                    response.setResult("The user successfully deleted");
                else
                    response.setResult("There is unknown error on server");
            }
            else
                response.setResult("There is no such user");
        }

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "CreateUserRequest")
    @ResponsePayload
    public CreateUserResponse CreateUser(@RequestPayload CreateUserRequest request) {

        System.out.println("[" + request.getUser().getUsername() + "]");

        CreateUserResponse response = new CreateUserResponse();

        String username = GetUserName(request.getId());

        if(null == username  ||  !DB.checkUser(username)){
            response.setResult("Please log in to use this operation");
        }
        else if(!DB.IsAdmin(username))
            response.setResult("It is not allowed operation");
        else {
            User now = request.getUser();

            if(!DB.checkUser(now.getUsername())) {
                if(DB.addUser(now))
                    response.setResult("The user is successfully added");
                else
                    response.setResult("There is error. Please fill all fields");
            }
            else
                response.setResult("The user with specified username is already exists");

        }

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "GetUsersRequest")
    @ResponsePayload
    public GetUsersResponse Getusers(@RequestPayload GetUsersRequest request) {
        GetUsersResponse response = new GetUsersResponse();

        String username = GetUserName(request.getId());

        if(null == username  ||  !DB.checkUser(username)){
            response.setCount(-1);
        }
        else{
            response = DB.getUsers();
        }

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "ExitRequest")
    @ResponsePayload
    public void Exit(@RequestPayload ExitRequest request) {
        DeleteId(request.getId(), "id");
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "DenemeRequest")
    @ResponsePayload
    public DenemeResponse dd(@RequestPayload DenemeRequest request) {
        DenemeResponse response = new DenemeResponse();

        response.getUsers().add("alma");
        response.getUsers().add("bilen");
        response.getUsers().add("erik");

        return response;
    }


    private void DeleteId(String x, String type){
        synchronized (snc) {
            int tmp = -1;

            for (int i = 0; i < Ids.size(); i++) {
                if (type.equals("id") && Ids.get(i).getKey().equals(x))
                    tmp = i;
                if (type.equals("username") && Ids.get(i).getValue().equals(x))
                    tmp = i;
            }

            if(tmp != -1)
                Ids.remove(tmp);
        }
    }



    private String GetId(String username){
        synchronized (snc) {
            for (Pair i : Ids) {
                if (i.getValue().equals(username))
                return (String) i.getKey();
            }

            return null;
        }
    }

    private String GetUserName(String id){
        synchronized (snc) {
            for (Pair i : Ids) {
                if (i.getKey().equals(id))
                return (String) i.getValue();
            }

            return null;
        }
    }

    private String GenerateString(String username){
        synchronized (snc) {
            while (true) {
                String ret = "";
                int len = rand.nextInt(25) + 10;
                int have = 0;
                int[] A = {0, 1, 2};

                for (int i = 0; i < len; i++) {
                    int tmp = rand.nextInt(3);
                    char nw = (char) (C[tmp] + rand.nextInt(L[tmp]));

                    ret += nw;
                }

                for (Pair old : Ids) {
                    if (old.getKey().equals(ret))
                        have = 1;
                }

                if (have == 0) {
                    Ids.add( new Pair<>(ret, username) );
                    return ret;
                }
            }
        }
    }

}

