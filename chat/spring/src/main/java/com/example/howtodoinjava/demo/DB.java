package com.example.howtodoinjava.demo;


import own.GetUsersResponse;
import own.MessageInfo;
import own.ReadResponse;
import java.sql.*;
import own.User;

/**
 *
 * @author bayram
 */
public class DB {
    private final static Object snc = new Object();
    static Statement stmt;                  // maybe used for other
    
    
    public static void init(){
        try{


            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/DataBaseFor2?useSSL=false&allowPublicKeyRetrieval=true","root","password");

            stmt = con.createStatement();

            if( 2 == 1 )
            try{
                try{
                    DB.execute("drop table Messages");
                }catch (Exception e){};
                try {
                    DB.execute("drop table Users");
                } catch (Exception e){}

                DB.execute("create table Users( username varchar(20) not null primary key," +
                        "name varchar(20) not null," +
                        "surname varchar(20) not null," +
                        "email varchar(20)," +
                        "type varchar(20) not null," +
                        "password varchar(20))");

                DB.execute("create table Messages( sender varchar(20),"
                        + " id int not null auto_increment,"
                        + " receiver varchar(20),"
                        + "  msg varchar(255),"
                        + " time datetime,"
                        + " foreign key(sender) references Users(username) on delete set NULL on update cascade,"
                        + " foreign key(receiver) references Users(username) on delete set NULL on update cascade,"
                        + " primary key(id) )");
                DB.execute("insert into Users values('admin', 'admin', 'admin', 'admin@gmail.com', 'admin', 'enter')");

                //System.out.println("Tables installed");

            } catch(Exception e){
                System.err.println(e);
            }

        } catch(Exception e){
            System.out.println(e);
        }
    }

    public static Boolean addUser(User u){
        System.out.println("insert into Users(username,name,surname,email,type,password) " +
                "values('" + u.getUsername() + "','" + u.getName() + "','" + u.getSurname() +
                "','" + u.getEmail() + "','" + u.getType() + "','" + u.getPassword() + "')");

        try{
            execute("insert into Users(username,name,surname,email,type,password) " +
                    "values('" + u.getUsername() + "','" + u.getName() + "','" + u.getSurname() +
                    "','" + u.getEmail() + "','" + u.getType() + "','" + u.getPassword() + "')");
            return true;
        } catch(Exception e){
            System.out.println(e);
            return false;
        }


        
    }
    
    public static Boolean deleteUser(String username){
        try{
            execute("delete from Users where username='" + username + "'");
            return true;
        } catch(Exception e){
            System.out.println(e);
            return null;
        }
    }
    
    public static Boolean updateUser(User u, String oldName){
        try{
            execute("Update Users "
                    + "set username='" + u.getUsername() + "', name='" + u.getName() +
                    "', surname='" + u.getSurname() + "', email='" + u.getEmail() +
                    "', type='" + u.getType() + "', password='" + u.getPassword()
                    + "where username='" + oldName + "'");
            return true;
        } catch(Exception e){
            System.out.println(e);
            return false;
        }
    }
    
    public static User readUser(String username){
        try{
            
            ResultSet res = executeQuery("select * from Users where username='" + username + "'");
            res.next();

            User ret = new User();

            ret.setUsername(res.getString("username"));
            ret.setName(res.getString("name"));
            ret.setSurname(res.getString("surname"));
            ret.setEmail(res.getString("email"));
            ret.setType(res.getString("type"));
            //ret.setPassword(res.getString("password"));
            ret.setPassword("-");
            
            return ret;
        } catch(Exception e){
            System.out.println(e);
            return null;
        }
    }

    public static Boolean IsAdmin(String username){
        try{
            ResultSet res = executeQuery("select type from Users where username='" + username + "'");

            if( res.next() == false )
                return false;

            if(res.getString("type").equals("admin"))
                return true;

            return false;

        } catch (Exception e){
            return false;
        }
    }

    public static Boolean addMessage(String from, String to, String msg){
        java.util.Date dt = new java.util.Date();
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String currentTime = sdf.format(dt);
        
        try{
            execute("insert into Messages(sender,receiver,msg,time) "
                    + "values('" + from + "','" + to + "','" + msg + "','" +  currentTime + "')");
            return true;
        } catch(Exception e){
            System.out.println(e);
            return false;
        }
    }
    
    public static ReadResponse readMessage(String username, String type){
        try{
            String a = "sender";
            String b = "receiver";
            if(type.equals("in")){
                a = "receiver";
                b = "sender";
            }

            ResultSet res = executeQuery("select sender,receiver,time,msg from Messages "
                    + "where " + a + "='" + username + "'");

            ReadResponse ret = new ReadResponse();
            ret.setCount(0);

            while(res.next()){
                MessageInfo tmp = new MessageInfo();
                ret.setCount(ret.getCount()+1);
                tmp.setTo(res.getString("receiver"));
                tmp.setFrom(res.getString("sender"));
                tmp.setTime(res.getString("time"));
                tmp.setMessage(res.getString("msg"));

                ret.getMsg().add(tmp);
            }

            ret.setResult("");
            
            return ret;
            
        } catch(Exception e){
            System.out.println(e);
            return null;
        }
    }
    
    public static Boolean checkUser(String username){
        try{
            ResultSet res = executeQuery("select username from Users where username= BINARY '" + username + "'");
            return res.next();
        } catch(Exception e){
            System.out.println(e);
            return false;
        }
    }
    
    public static int checkUserPassword(String username, String password){
        try{
            ResultSet res = executeQuery("select password,type from Users where username='" + username + "'");
            res.next();
            if(password.equals(res.getString(1))){
                if("admin".equals(res.getString(2)))
                    return 2;
                return 1;
            }
            else
                return 0;
        } catch(Exception e){
            System.out.println(e);
            return 0;
        }
    }

    public static GetUsersResponse getUsers(){
        try{
            ResultSet res = executeQuery("select username from Users");

            GetUsersResponse ret = new GetUsersResponse();
            ret.setCount(0);

            while(res.next()) {
                ret.setCount(ret.getCount()+1);
                ret.getUsers().add(res.getString("username"));
            }

            return ret;

        } catch(Exception e){
            return null;
        }
    }

    public static void execute(String query) throws Exception{
        synchronized(snc){
            stmt.execute(query);
        }
    }

    public static ResultSet executeQuery(String query) throws Exception{
        synchronized(snc){
            return stmt.executeQuery(query);
        }
    }
}
