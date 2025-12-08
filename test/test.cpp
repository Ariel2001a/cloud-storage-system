#include <gtest/gtest.h>
//#include <gmock/gmock.h>
#include <fstream>
#include <string>
#include <iostream>
#include <map>
#include <vector>
#include <thread>
#include <atomic>
#include <mutex>
#include <chrono>
#include <condition_variable>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <cstdlib>
#include <map>



#include "Server.h"
#include "MockServer.h"
#include "SearchCommand.h"
#include "GetCommand.h"
#include "deletecommand.h"
#include "Compressor.h"
#include "Parser.h"
#include "ICommand.h"
#include "AddCommand.h"
#include "Config.h"
#include "TCPServerCommunication.h"
#include "HandleClient.h"
#include "CommandManager.h"

using namespace std;
//using ::testing::_;
//using ::testing::Return;

// --- Validation tests ---
// Check parsing and validation for multiple arguments
TEST(ValidateInputTest, ValidInputWithMultipleArgs) {
    string line = "post file1.txt Hello World";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

// Check single argument input
TEST(ValidateInputTest, ValidInputWithSingleArg) {
    string line = "post file2.txt";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

// Check long argument input with spaces
TEST(ValidateInputTest, ValidInputWithLongArg) {
    string line = "post notes.txt Hello my friend";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

// Missing argument should fail validation
TEST(ValidateInputTest, MissingArgument) {
    string line = "post";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_FALSE(Parser::validateInput(cmd, args));
}

// Only whitespace after command should fail
TEST(ValidateInputTest, OnlyWhitespaceAfterCommand) {
    string line = "post  ";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_FALSE(Parser::validateInput(cmd, args));
}

// Argument that is whitespace only should fail
TEST(ValidateInputTest, ArgIsWhitespace) {
    string line = "post    file.txt    ";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_FALSE(Parser::validateInput(cmd, args));
}


TEST(ValidateInputTest, ValidInputWithUppercaseCommand) {
    string line = "POST file3.txt Content";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseAddCommand1) {
    string line = "PosT file3.txt Content";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseAddCommand2) {
    string line = "POst file3.txt Content";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseAddCommand3) {
    string line = "pOST file3.txt Content";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseGetCommand1) {
    string line = "GeT file3.txt Content";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseGetCommand2) {
    string line = "GEt file3.txt Content";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseGetCommand3) {
    string line = "gET file3.txt Content";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseGetCommand4) {
    string line = "GET file3.txt Content";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseSearchCommand1) {
    string line = "SeArcH file3.txt Content";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseSearchCommand2) {
    string line = "SEarch file3.txt Content";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseSearchCommand3) {
    string line = "seaRCH file3.txt Content";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE(Parser::validateInput(cmd, args));
}

TEST(ValidateInputTest, ValidInputWithUpperAndLowercaseSearchCommand4) {
    string line = "SEARCH file3.txt Content";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    EXPECT_TRUE (Parser::validateInput(cmd, args));
}


TEST(AddCommandTest, AddNewFileAndDuplicateAdd) {
    string line = "post notes.txt my friend";
    string cmd = Parser::parseCmd(line);
    vector<string> args = Parser::parseArgs(line,cmd);
    AddCommand addcmd;
    string msg= addcmd.run(args);
    EXPECT_EQ(msg, "201 Created");
    string msg1= addcmd.run(args);
    EXPECT_EQ(msg1, "404 Not Found");
}


// --- Compressor tests ---
// Compress normal string without spaces
TEST(CompressorTest, Compress_NormalString) {
   
    string input = "aaabbc";
    string expected = "3a2b1c";
    EXPECT_EQ(Compressor::compress(input), expected);
}

// Compress string with spaces
TEST(CompressorTest, Compress_StringWithSpaces) {
    string input = "aa a b  c";
    string expected = "2a 1a 1b  1c";
    EXPECT_EQ(Compressor::compress(input), expected);
}

// Compress string containing numbers
TEST(CompressorTest, Compress_StringWithNumbers) {
    string input = "aa11b";
    string expected = "2a2-11b";
    EXPECT_EQ(Compressor::compress(input), expected);
}

// Compress string containing hyphens
TEST(CompressorTest, Compress_StringWithHyphen) {
    string input = "aa-bb";
    string expected = "2a1--2b";
    EXPECT_EQ(Compressor::compress(input), expected);
}

// Compress empty string
TEST(CompressorTest, Compress_EmptyString) {
    string input = "";
    string expected = "";
    EXPECT_EQ(Compressor::compress(input), expected);
}

// Compress string with only spaces
TEST(CompressorTest, Compress_SpacesOnly) {
    string input = "   ";
    string expected = "   ";
    EXPECT_EQ(Compressor::compress(input), expected);
}

// Compress mixed characters (letters, numbers, hyphens, spaces)
TEST(CompressorTest, Compress_MixedCharacters) {
    string input = "aaA11-- bb";
    string expected = "2a1A2-12-- 2b";
    EXPECT_EQ(Compressor::compress(input), expected);
}

// Decompress test for multiple examples
TEST(CompressorTests, DecompressTest) {
    string compressed = "1H1e2l1o 1W1o1r1l1d";
    string expected = "Hello World"; 
    EXPECT_EQ(Compressor::decompress(compressed), expected);

    compressed = "2-21-110-13--4A";
    expected = "2211111111111---AAAA"; 
    EXPECT_EQ(Compressor::decompress(compressed), expected);

    compressed = "2---2";
    expected = ""; 
    EXPECT_EQ(Compressor::decompress(compressed), expected);
}

//--- ICommand tests ---
// Check GetFolderPath retrieves correct environment variable path
TEST(CommandTests, GetFolderTest) {
    vector<ICommand*> commands={new GetCommand(),  new SearchCommand(),new deletecommand(), new AddCommand()};
     for(auto cmd:commands){
        string expectedPath = string(getenv("EX1_DIR"));
        EXPECT_EQ(cmd->GetFolderPath(), expectedPath);
     }
}

// --- GetCommand tests ---
// Check environment variable path
TEST(GetCommandTests, InvalidGetCommandTest) {
    GetCommand getcmd3;
    std::vector<std::string> args3 = {};
    string msg= getcmd3.run(args3);
    EXPECT_EQ(msg, "400 Bad Request");
    
}

// Check reading compressed file content
TEST(GetCommandTests, GetFileContentTest) {
    GetCommand getcmd;
    string expectedPath = string(getenv("EX1_DIR")) + "/CONFIG_FILE";
    ofstream(expectedPath) << Compressor::compress("World");
    EXPECT_STREQ(getcmd.getContentFile(expectedPath).c_str(), "1W1o1r1l1d");
}

// Check run function prints decompressed content
TEST(GetCommandTests, RunTest) {
    string expectedPath = string(getenv("EX1_DIR")) + "/CONFIG_FILE";
    ofstream(expectedPath) << Compressor::compress("World");
    GetCommand getcmd;
    vector<string> args = {"CONFIG_FILE"};
    string msg= getcmd.run(args);
    EXPECT_EQ(msg, "200 Ok\n\nWorld");
}


TEST(GetCommandTest, ValidInputButNonExistentFile) {
    GetCommand getcmd2;
    std::vector<std::string> args2 = {"NON_EXISTENT_FILE"};
    string msg= getcmd2.run(args2);
    EXPECT_EQ(msg, "404 Not Found");
}

// Helper: create test files for SearchCommand tests
void CreateTestFiles(const std::string& folder) {
    std::ofstream(folder + "/First.txt") << Compressor::compress("this is the first file");
    std::ofstream(folder + "/Second.txt") << Compressor::compress("now im saving the second test file");
    std::ofstream(folder + "/Third.txt") << Compressor::compress("and this the last test file");
    std::ofstream(folder + "/Fourth.txt") << Compressor::compress("Fourth");
}

// Helper: check if a vector contains a value
bool contains(const std::vector<std::string>& vec, const std::string& value) {
    for (const auto& s : vec) {
        if (s == value) return true;
    }
    return false;
}

// --- SearchCommand tests ---
// Single file match
TEST(SearchTests, SingleMatch_test)
{
    SearchCommand searchCmd;
    std::string folder = searchCmd.GetFolderPath();
    CreateTestFiles(folder);
    auto results = searchCmd.search("sec");
    ASSERT_EQ(results.size(), 1);
    EXPECT_EQ(results[0], "Second.txt");
    string msg = searchCmd.run({"sec"});
    EXPECT_EQ(msg, "200 Ok\n\nSecond.txt");
}

// Multiple files match
TEST(SearchTests, MultipleMatch_test)
{
    SearchCommand searchCmd;
    std::string folder = searchCmd.GetFolderPath();
    CreateTestFiles(folder);
    auto results = searchCmd.search("file");
    ASSERT_EQ(results.size(), 3);
    EXPECT_TRUE(contains(results, "First.txt"));
    EXPECT_TRUE(contains(results, "Second.txt"));
    EXPECT_TRUE(contains(results, "Third.txt"));
}

// No match found
TEST(SearchTests, NoMatch_test)
{
    SearchCommand searchCmd;
    std::string folder = searchCmd.GetFolderPath();
    CreateTestFiles(folder);
    auto results = searchCmd.search("fourth");
    ASSERT_EQ(results.size(), 0);
    string msg = searchCmd.run({"fourth"});
    EXPECT_EQ(msg, LOGICAL_PROBLEM);
}

// Ensure spaces do not count as partial matches
TEST(SearchTests, Space_test)
{
    SearchCommand searchCmd;
    std::string folder = searchCmd.GetFolderPath();
    CreateTestFiles(folder);
    auto results = searchCmd.search("el");  // should not match "e l" or "le"
    ASSERT_EQ(results.size(), 0);
    string msg = searchCmd.run({"el"});
    EXPECT_EQ(msg, LOGICAL_PROBLEM);
    
}


//test search by file name
TEST(SearchTests, search_By_name)
{
    SearchCommand searchCmd;
    std::string folder = searchCmd.GetFolderPath();
    CreateTestFiles(folder);
    auto results = searchCmd.search("Third");  
    ASSERT_EQ(results.size(), 1);
    EXPECT_TRUE(contains(results, "Third.txt"));
    string msg = searchCmd.run({"Third"});
    EXPECT_EQ(msg, "200 Ok\n\nThird.txt");

}

//ensure no double files in search results
TEST(SearchTests, no_doubles)
{
    SearchCommand searchCmd;
    std::string folder = searchCmd.GetFolderPath();
    CreateTestFiles(folder);
    auto results = searchCmd.search("Fourth");  // finds it in name search and also in content search, make sure it doesnt appear twice in results
    ASSERT_EQ(results.size(), 1);
    EXPECT_TRUE(contains(results, "Fourth.txt"));
    string msg = searchCmd.run({"Fourth"});
    EXPECT_EQ(msg, "200 Ok\n\nFourth.txt");
}


   //Tests for delete function
   TEST(DeleteTests, simple_delete)
   {
    deletecommand deleteCMD;

    string msg= deleteCMD.run({"First.txt"});

    EXPECT_EQ(msg, "204 No Content");
   }

  

   TEST(DeleteTests,illegal_delete)
 {
    deletecommand deleteCMD;
    std::string folder = deleteCMD.GetFolderPath();
    CreateTestFiles(folder);
    string msg= deleteCMD.run({"Fifth.txt"});// do not exist
    EXPECT_EQ(msg, "404 Not Found");
}


//--- socker tests ---

TEST(TCPServerTest, HelpCommandInSingleTest) {
    std::mutex manager_mutex;
    CommandManager manager = HandleClient::init();
    TCPServerCommunication server(6000);

    std::thread serverThread([&]() {
        int client_socket = server.acceptClient();
        std::string message = server.read(client_socket);
        std::string response = HandleClient::processClient(message, manager, manager_mutex);
        server.write(client_socket, response);
        close(client_socket);
    });

    std::this_thread::sleep_for(std::chrono::milliseconds(200));

    int sock = socket(AF_INET, SOCK_STREAM, 0);
    ASSERT_GT(sock, 0);

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(6000);
    inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);

    ASSERT_EQ(connect(sock, (sockaddr*)&addr, sizeof(addr)), 0);

    const std::string cmd = "POST help help";
    send(sock, cmd.c_str(), cmd.size(), 0);

    char buffer[4096] = {0};
    int n = recv(sock, buffer, sizeof(buffer), 0);
    ASSERT_GT(n, 0);

    std::string response(buffer, n);
    EXPECT_EQ(response, SUCCESS_ADD);

    close(sock);
    serverThread.join();
}

TEST(TCPServerTest, MultipleClientsDifferentCommands) {
    std::mutex manager_mutex;
    CommandManager manager = HandleClient::init();
    TCPServerCommunication server(6001);

    std::thread serverThread([&]() {
        for (int i = 0; i < 8; ++i) {
            int client_socket = server.acceptClient();
            std::thread([client_socket, &manager, &manager_mutex, &server]() {
                std::string message = server.read(client_socket);
                std::string response = HandleClient::processClient(message, manager, manager_mutex);
                server.write(client_socket, response);
                close(client_socket);
            }).detach();
        }
    });

    std::this_thread::sleep_for(std::chrono::milliseconds(100));

    const std::string commands[8] = {
        "POST test2 This is a socket test-file",
        "GET test2",
        "SEARCH st2",
        "SEARCH socket",
        "POST test2 test2",
        "DELETE test2",
        "DELETE test2",
        "GET test2"
    };

    const std::map<std::string, std::string> expectedResponses = {
        {"POST test2 This is a socket test-file", "201 Created"},
        {"GET test2", "200 Ok\n\nThis is a socket test-file"},
        {"SEARCH st2", "200 Ok\n\ntest2"},
        {"SEARCH socket", "200 Ok\n\ntest2"},
        {"POST test2 test2", "404 Not Found"},
        {"DELETE test2", "204 No Content"},
        {"DELETE test2", "404 Not Found"},
        {"GET test2", "404 Not Found"}
    };

    std::mutex order_mutex;
    std::condition_variable cv;
    int nextClientId = 0;

    auto clientTask = [&](int clientId) {
        std::unique_lock<std::mutex> lock(order_mutex);
        cv.wait(lock, [&] { return clientId == nextClientId; });
        nextClientId++;
        cv.notify_all();
        lock.unlock();

        int sock = socket(AF_INET, SOCK_STREAM, 0);
        ASSERT_GT(sock, 0);

        sockaddr_in addr{};
        addr.sin_family = AF_INET;
        addr.sin_port = htons(6001);
        inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);

        ASSERT_EQ(connect(sock, (sockaddr*)&addr, sizeof(addr)), 0);

        std::string cmd = commands[clientId];
        send(sock, cmd.c_str(), cmd.size(), 0);

        char buffer[4096] = {0};
        int n = recv(sock, buffer, sizeof(buffer), 0);
        ASSERT_GT(n, 0);

        std::string response(buffer, n);
        EXPECT_EQ(response, expectedResponses.at(cmd));

        close(sock);
    };

    std::thread clientThreads[8];
    for (int i = 0; i < 8; ++i) {
        clientThreads[i] = std::thread(clientTask, i);
    }

    for (int i = 0; i < 8; ++i) {
        clientThreads[i].join();
    }

    serverThread.join();
}




/*

TEST(ServerTest, AcceptClientSuccess) {
    TCPServerCommunication tcpComm(0);
    tcp_client_socket = tcpComm.acceptClient(); // מחובר ללקוח כלשהו
    EXPECT_EQ(result, 5);
}

TEST(ServerTest, AcceptClientFailure) {
    MockServer server({-1});
    int result = server.accept_client();
    EXPECT_EQ(result, -1);
}

TEST(ServerMultiClientTest, HandlesMultipleClientsInParallelInOrder) {
    Server server;
    const int numClients = 4;
    std::vector<int> results(numClients);
    std::vector<std::thread> threads;
    std::mutex mtx;
    std::condition_variable cv;
    std::atomic<int> next_index{0};

    for (int i = 0; i < numClients; ++i) {
        threads.emplace_back([i, &results, &mtx, &cv, &next_index]() {
            int client_fd = 100 + i;  // לדוגמה, מספר כל לקוח
            std::unique_lock<std::mutex> lock(mtx);
            cv.wait(lock, [&]() { return i == next_index.load(); });
            results[i] = client_fd;
            next_index++;
            cv.notify_all();
        });
    }

    for (auto& t : threads) t.join();

    std::vector<int> expected = {100, 101, 102, 103};
    EXPECT_EQ(results, expected);
}

TEST(ServerMultiClientTest, HandlesSomeClientsFailingInOrder) {
    std::vector<int> expected = {200, 201, -1};
    MockServer server(expected);

    const int client_count = expected.size();
    std::vector<int> results(client_count, -1);

    std::mutex mtx;
    std::condition_variable cv;
    int next_index = 0;

    std::vector<std::thread> threads;

    for (int i = 0; i < client_count; ++i) {
        threads.emplace_back([&]() {
            int res = server.accept_client();
            std::unique_lock<std::mutex> lock(mtx);
            int idx = next_index++;
            results[idx] = res;
        });
    }

    for (auto& t : threads) t.join();

    EXPECT_EQ(results, expected);
}

TEST(MessageHandlingTest, ValidMessage) {
    Server server;
    std::string msg = "HELLO";
    std::string result = server.handle_message(msg);
    EXPECT_EQ(result, "OK");
}

TEST(MessageHandlingTest, EmptyMessage) {
    Server server;
    std::string msg = "";
    std::string result = server.handle_message(msg);
    EXPECT_EQ(result, "ERROR: Empty message");
}

TEST(MessageHandlingTest, ComplexMessage) {
    Server server;
    std::string msg = "ADD 123 DATA";
    std::string result = server.handle_message(msg);
    EXPECT_EQ(result, "OK");
}

TEST(MessageHandlingTest, InvalidCharacters) {
    Server server;
    std::string msg = "HELLO@#";
    std::string result = server.handle_message(msg);
    EXPECT_EQ(result, "ERROR: Invalid characters");
}


TEST(MessageHandlingTest, ParallelMessages) {
    Server server;
    std::vector<std::string> msgs = {"MSG1", "MSG2", "MSG3"};
    std::vector<std::string> results(msgs.size());
    std::vector<std::thread> threads;

    for (size_t i = 0; i < msgs.size(); ++i) {
        threads.emplace_back([&, i](){  // i נלקח כ-value
            results[i] = server.handle_message(msgs[i]);
        });
    }

    for (auto& t : threads) t.join();

    for (auto& r : results) {
        EXPECT_EQ(r, "OK");
    }
}
*/

// --- GoogleTest main ---
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}