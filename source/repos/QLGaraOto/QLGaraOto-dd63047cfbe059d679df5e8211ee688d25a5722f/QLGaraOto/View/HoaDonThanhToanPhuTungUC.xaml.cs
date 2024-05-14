using QLGaraOto.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace QLGaraOto.View
{
    /// <summary>
    /// Interaction logic for HoaDonThanhToanPhuTungUC.xaml
    /// </summary>
    public partial class HoaDonThanhToanPhuTungUC : UserControl
    {
        public HoaDonThanhToanPhuTung ViewModel { get; set; }
        public HoaDonThanhToanPhuTungUC()
        {
            InitializeComponent();
            this.DataContext = ViewModel=new HoaDonThanhToanPhuTung();
        }
    }
}
