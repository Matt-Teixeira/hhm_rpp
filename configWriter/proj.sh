#{ Varsetting...

TIMEVAR="14 days ago"

touch ./Siemens_Files
touch ./Philips_Cath
touch ./Philips_CT
touch ./Philips_MRI
touch ./GE_Cath
touch ./GE_Imaging

echo -n "" > ./Siemens_Files
echo -n "" > ./Philips_Cath
echo -n "" > ./Philips_CT
echo -n "" > ./Philips_MRI
echo -n "" > ./GE_Cath
echo -n "" > ./GE_Imaging
#} End Varsetting

FILEVAR=$(find /opt/hhm-files/*/*/*/*.* -newermt "$TIMEVAR" -ls | sed -n '/-/p' | sed -n -E '/.*[0-9].*.status$/!p' | awk '{print $11, $8, $9, $10}' | sort | awk '{print $2, $3, $4, $1}')
PHILVAR=$(find /opt/hhm-files/*/*/*/daily*/Event.zip -newermt "$TIMEVAR" -ls | sed -n '/-/p' | sed -n -E '/.*[0-9].*.status$/!p' | awk '{print $11, $8, $9, $10}' | sort | awk '{print $2, $3, $4, $1}')
#DIRYVAR=$(find /opt/hhm-files/*/*/*/daily* -type d -newermt "$TIMEVAR" -ls | sed -n '/-/p' | sed -n -E '/.*[0-9].*.status$/!p' | awk '{print $11, $8, $9, $10}' | sort | awk '{print $2, $3, $4, $1}')

# Place For Testing Below...
#echo "$DIRYVAR" | sed -n -E '/.*daily.*/p' | sed -n -E '/.*MiniDumps.*/!p' | sed 's/\/daily/ daily/' | awk '{print $0}'| less
#echo "$PHILVAR" | less
#echo "$FILEVAR" | sed -n -E '/.*logcurrent.log/p' | less

echo "$FILEVAR" | sed -n -E '/.*EvtApplication_Today.txt/p' >> ./Siemens_Files
echo "$PHILVAR" | sed -n -E '/.*daily.*/p' >> Philips_Cath
echo "$FILEVAR" | sed -n -E '/.*Output.mdb/p' >> ./Philips_CT
echo "$FILEVAR" | sed -n -E '/.*logcurrent.log/p' >> ./Philips_MRI
echo "$FILEVAR" | sed -n -E '/.*Logcurrent.log/p' >> ./Philips_MRI
echo "$FILEVAR" | sed -n -E '/.*sysError.*/p' >> ./GE_Cath
echo "$FILEVAR" | sed -n -E '/.*gesys.*/p' >> ./GE_Imaging
