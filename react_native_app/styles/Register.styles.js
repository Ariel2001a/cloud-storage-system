import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 25, backgroundColor: '#fff', justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 200, height: 200, resizeMode: 'contain' },
  mainHeadline: { fontSize: 22, fontWeight: 'bold', color: '#202124' },
  secondaryHeadline: { fontSize: 14, color: '#1a73e8', marginTop: 10 },
  form: { width: '100%' },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btn: { flex: 0.48, height: 45, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  uploadBtn: { backgroundColor: '#f1f3f4', borderWidth: 1, borderColor: '#dadce0' },
  registerBtn: { backgroundColor: '#1a73e8' },
  btnText: { fontWeight: '600', fontSize: 14 },
  imagePreviewContainer: {
    alignSelf: 'center',
    marginTop: 20,
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ddd'
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' }
});

export default styles;