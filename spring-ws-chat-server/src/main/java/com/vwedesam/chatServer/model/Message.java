package com.vwedesam.chatServer.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Message {

    private String senderName;

    private String receiverName;

    private String message;

    private String data;

    private Status status;

}
