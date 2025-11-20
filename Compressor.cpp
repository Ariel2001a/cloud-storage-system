#include "Compressor.h"
#include <string>

using namespace std;

string Compressor::compress(const string& text){
            int count=0;
        for(int i=0;i<text.length();i++){
             if (text[i] == ' ')
            {
                compresssedText+=' ';
                count=0;
                continue;
            }
            count++;
            if(text[i]!=text[i+1]){
                compresssedText+=std::to_string(count)+text[i];
                count=0;
            }           
        }
        return compresssedText;
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