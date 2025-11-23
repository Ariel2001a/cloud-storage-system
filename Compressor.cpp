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
    std::string decompressed_content="";
    size_t i = 0;

    while (i < compress_content.length()) {
        char char_for_expansion;
        int count = 0;
        if (compress_content[i] == ' ') {
            decompressed_content += ' ';
            i++;
            continue;
        }
        else {
            if (!(compress_content[i] >= '0' && compress_content[i] <= '9')) {
                return "";
            }

            while (i < compress_content.length() && compress_content[i] >= '0' && compress_content[i] <= '9') {
                count = count * 10 + (compress_content[i] - '0');
                i++;
            }

            if (i >= compress_content.length()) {
                return "";
            }
            char_for_expansion = compress_content[i];
            if(char_for_expansion == '-') {
                i++;
                if (i >= compress_content.length()) {
                    return "";
                }
                char_for_expansion = compress_content[i];
            }
        }
        decompressed_content.append(count, char_for_expansion);
        if(i < compress_content.length()){
            i++;
        }
    }
    return decompressed_content;
};