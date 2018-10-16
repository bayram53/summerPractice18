package com.example.howtodoinjava.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.sql.*;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
	    DB.init();

        SpringApplication.run(DemoApplication.class, args);

        /*try (ServerSocket serverSocket = new ServerSocket(8080)) {

            System.out.println("Waiting for clients");

            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("Connected");
                //Runnable worker = new RequestHandler(clientSocket);
                //executor.execute(worker);
            }
        } catch (Exception e) {
            System.out.println(e);
        }*/
    }
}
