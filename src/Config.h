// Config.h
// This file defines constants used throughout the application for
// HTTP-like response messages and command identifiers. 
// It centralizes these values to make them easy to manage and change.

#ifndef CONFIG_H
#define CONFIG_H


// Response messages for different operations
#define SUCCESS_ADD "201 Created"
#define SUCCESS_GET "200 Ok\n\n"
#define SUCCESS_SEARCH "200 Ok\n\n"
#define SUCCESS_DELETE "204 No Content"
#define LOGICAL_PROBLEM "404 Not Found"
#define INVALID_COMMAND "400 Bad Request"
#define SERVER_ERROR "500 Internal Server Error"

#define ADD_COMMAND "post"
#define GET_COMMAND "get"
#define SEARCH_COMMAND "search"
#define DELETE_COMMAND "delete"

#endif // CONFIG_H