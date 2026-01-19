import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 25, backgroundColor: '#fff', justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 150, height: 150, resizeMode: 'contain', marginBottom: 15 },
  mainHeadline: { fontSize: 22, fontWeight: 'bold', color: '#202124', marginBottom: 10 },
  signUpRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  secondaryHeadline: { fontSize: 14, color: '#202124' },
  form: { width: '100%' },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  signInBtn: {
    backgroundColor: '#1a73e8',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default styles;