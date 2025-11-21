#ifndef COMPRESSOR_H
#define COMPRESSOR_H
#include <string>

using namespace std;

// Compressor class for compressing and decompressing text
class Compressor{
    public:

        // Compresses the input text
        string compress(const string& text);

        // Decompresses the input compressed text
        string decompress(const string& compressedText);
};
#endif