#include "Compressor.h"
#include <string>

using namespace std;

// Compresses the input text using a simple run-length encoding algorithm
string Compressor::compress(const string& text){
            int count=0;
            string compressedText;

        // Compressed text result
        for(int i=0;i<text.length();i++){

            // Handle spaces separately
             if (text[i] == ' ')
            {
                compressedText+=' ';
                count=0;
                continue;
            }
            count++;

            // If the current character is different from the next one, append the count and character to the result
            if(text[i]!=text[i+1]){
                compressedText+=std::to_string(count)+text[i];
                count=0;
            }           
        }
        return compressedText;
}

string Compressor::decompress(const string& compress_content){
        std::string decompressed_content;
    size_t i = 0;

    while (i < compress_content.length()) {
        char current_char = compress_content[i++];
        int count = 0;

        if (current_char == ' ') {
            count = 1;
        } 
        else {
            if (i >= compress_content.length() || !(compress_content[i] >= '0' && compress_content[i] <= '9')) {
                return "";
            }

            while (i < compress_content.length() && compress_content[i] >= '0' && compress_content[i] <= '9') {
                count = count * 10 + (compress_content[i] - '0');
                i++;
            }
        }

        decompressed_content.append(count, current_char);
    }

    return decompressed_content;
}